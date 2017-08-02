// db查询基类

class query{
    constructor(){
    }
    get(query,func,type = 'list'){
        _config.db.conn.query(query, function (error, result, fields) {
            if(! error){
                if(type === 'info'){
                    result = result[0];
                }
                func(result,error);
            }else{
                let err = `<h1>Sql Error</h1><p>${error.sqlMessage}</p>`;
                response.send( err );
            }
        });
    }
    reset_query(){
        this._table = this._where = this._order = null;
    }
    info(query,func){
        return get(query,func,'info');
    }
    // 链式快捷选择表
    table(tableName){
        this._table = tableName;
        return this;
    }
    // 链式Where条件带入
    where(where){
        bt.log(where);
        this._where = null;
        // 条件字段的拼接
        let _whereArray = [];
        for(let _query in where){
            _whereArray.push( `${_query} = ${(function(){
                if(typeof where[_query] === 'number'){
                    return where[_query];
                }else{
                    return `'${where[_query]}'`;
                }
            })()}` )
        }
        this._where = _whereArray.join(' and ');
        return this;
    }
    order(__order){
        this._order = `order by ${__order}`;
        return this;
    }
    limit(limit){
        this._limit = `limit ${limit}`;
        return this;
    }
    // 链式快捷选择字段
    select(){
        let fileds = [ '*' ],
            func = null,
            type = 'list';
        for(let item of arguments){
            let object = Object.prototype.toString;
            if(object.call(item) === '[object Array]'){
                fileds = item;
            }
            else if(object.call(item) === '[object Function]'){
                func = item;
            }
            else if(object.call(item) === '[object String]'){
                type = item;
            }
        }
        let _where = '',_order = '';
        if(this._where){
            _where = ` where ${this._where}`;
        }
        this._sql = `select ${fileds.join(',')} from ${this._table} ${_where} ${this._order} ${this._limit}`;
        // 重置query参数
        this.reset_query();
        return this.get(this._sql,func,type);
    }
    // 输出最后一次执行的Sql
    get lastsql(){
        return this._sql;
    }
}

module.exports =  query;