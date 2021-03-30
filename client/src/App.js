import React, {Component} from 'react';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root : {
    width: '100%',
    marginTop : theme.spacing.unit * 3,
    overflowX:'auto'
  },
  table: {
    minWidth : 1080
  },
  progress : {
    margin : theme.spacing(2)
  }
});

/*
1) constuctor()

2) componentWillMount()

3) render()

4) componentDidMount()
*/
/* 
props or state changed => shouldComponenetUpdate()
*/

class App extends React.Component {
  state = {
    customers : "",
    completed : 0
  }

  render(){
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root}>
          <Table className = {classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>이미지</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>생년월일</TableCell>
                <TableCell>성별</TableCell>
                <TableCell>직업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.customers ? this.state.customers.map(c => {
                  return (
                    <Customer  
                      key = {c.id}
                      id ={c.id}
                      image = {c.image}
                      name = {c.user_name}
                      birthday = {c.birthday}
                      gender = {c.gender}
                      job = {c.job}
                    />
                  );
                }) : 
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress className = {classes.progress} variant="determinate"
                      value = {this.state.completed} />
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
        <CustomerAdd />
      </div>
    );
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 60);
    this.callApi()
      .then(res => this.setState({customers : res}))
      .then(clearInterval(this.timer))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  progress = () => {
    const { completed }  = this.state;
    this.setState({completed : completed >= 100 ? 0 : completed + 1});
  }

}


export default withStyles(styles)(App);
