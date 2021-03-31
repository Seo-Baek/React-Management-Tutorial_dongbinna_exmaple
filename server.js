const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host : conf.host,
    user : conf.user,
    password : conf.password,
    port : conf.port,
    database : conf.database
});
connection.connect();

const multer = require('multer');
const upload = multer({dest : './upload'});

app.get('/api/customers',(req,res) => {
     connection.query(
         "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
         (err, rows, fields) => {
             res.send(rows);
         }
     )
});

// upload 폴더에 직접적으로 접근할 수 없도록 image라는 경로로 표시하고 upload로 연결
app.use('/image',express.static('./upload'));

// multipart/form-data는 POST로 데이터 전달, 라우트는 반드시 post() 사용
/** 파일 단일 객체의 경우 single(), 다중 객체인 경우 array() 사용 
 *  여러 파일을 하나의 이름으로 묶지 않고 업로드 하는 경우 fields() 사용
 *  .single(filedname)
 *  .array(fieldname[,maxCount]) << fieldname 인자에 명시된 이름의 파일 전부 배열 형태로 전달
 *                                  선택적으로 maxCount이상 값은 에러 출력
 *                                  전달 된 배열 형태의 파일은 req.files에 저장
 *  .field(fields) feilds는 name과 maxCount(선택사항)을 포함하는 Object 배열이어야 함
*/
app.post('/api/customers', upload.single('image'),(req,res) => {
    //now() mariaDB의 SYSDATE
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?,?,?,?,?,now(),0,null)';
    let image = (req.file != null && req.file != undefined && req.file != '')?'/image/' + req.file.filename : '';
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    console.log(params);
    connection.query(sql, params,
        (err, rows, fields) => {
             res.send(rows);
        }
    );
});

app.delete('/api/customers/:id',(req,res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 AND deletedDate = NOW() WHERE id =?';
    let params = [req.params.id];
    connection.query(sql,params,
        (err,rows,fields) => {
            res.send(rows);
             console.log(rows);
             console.log(err);
        });
});

app.listen(port,()=> console.log(`Listening on port ${port}`));