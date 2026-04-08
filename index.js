import express from 'express'
import mysql from 'mysql2'

//express 객체 생성
const app = express();

// MySQL 연결 설정
const db = mysql.createConnection({
    host : 'localhost',
    user : 'jsuser',
    password : 'pwjs1234',
    database : 'jsdb'
});

//MySQL 연결 확인
db.connect((err)=>{
    if(err){
        console.log('DB Connection is failed..');
        return ; //실행종료
    }else{
        console.log('DB Connected...');
    }    
});


//루트 라우트 설정
app.get('/', (req, res) => {
    res.send("<h1>Hello</h1>");
});

// 상품 목록 조회
app.get('/products', (req, res)=>{
    const sql = "select * from product";
    db.query(sql,(err, results)=>{
        if(err){
            res.status(500).send("상품 조회 중 오류가 발생했습니다.");
            return ; // 실행 종료
        }        
        res.json(results); // 결과 데이터를 json 형식으로 반환
    });
});

// json 요청이 오면 본문(body) 파싱을 위한 미들웨어
app.use(express.json());

// 상품 등록 처리
app.post('/products', (req,res)=>{
    const {productName, price} = req.body;
    // ? - 동적 바인딩 기호
    const sql = "insert into product(product_name, price) values(?,?)";
    db.query(sql,[productName, price], (err, results) =>{
        if(err){
            res.status(500).send("상품 등록 중 오류가 발생했습니다.");
            return ; // 실행 종료
        }        
        res.send("상품이 성공적으로 등록 되었습니다.");
    });
});

// 상품 정보 상세보기
// http://localhost:8000/products/2
app.get('/products/:id', (req,res)=>{
    const productId = req.params.id;
    const sql = "select * from product where id = ?";
    db.query(sql,[productId], (err, results) => {
        if(err){
            res.status(500).send("상품 조회 중 오류가 발생했습니다.");
            return ; // 실행 종료
        }
        res.json(results[0]);
    });
});

// 상품 수정 처리
app.put('/products/:id', (req,res)=>{
    const productId = req.params.id;
    const {productName, price} = req.body
    const sql = "update product set product_name = ?, price = ? where id = ?";
    db.query(sql,[productName, price, productId], (err, results) => {
        if(err){
            res.status(500).send("상품 수정 중 오류가 발생했습니다.");
            return ; // 실행 종료
        }
        res.send("상품이 성공적으로 수정 되었습니다.");
    });  
});

// 상품 삭제 처리
app.delete('/products/:id', (req,res)=>{
    const productId = req.params.id;    
    const sql = "delete from product where id = ?";
    db.query(sql,[productId], (err, results) => {
        if(err){
            res.status(500).send("상품 삭제 중 오류가 발생했습니다.");
            return ; // 실행 종료
        }
        res.status(201).send("상품이 성공적으로 삭제 되었습니다.");
    });  
});

//서버 시작
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Start server..${PORT}`);    
});

