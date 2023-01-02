class Tables {
  init(connection) {
      this.connection = connection;
      this.creatUser();
  }
  creatUser() {
      const sql = `CREATE TABLE IF NOT EXISTS User (Matricula int NOT NULL UNIQUE,
        userName varchar(14) NOT NULL,Adm TINYINT(1) DEFAULT 0, password varchar(200) NOT NULL,
        PRIMARY KEY (Matricula) )`;
      this.connection.query(sql, err => err ? console.log('mysql error', err) : console.log('table User created') );
  }

}
module.exports = new Tables