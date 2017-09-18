var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
    console.log("server run at localhost:8000");
	if (req.method == "POST")
	{
        getUser(req,res);
        console.log("getdaole");
    }
    else
    {
		var str = querystring.parse(url.parse(req.url).query);
		var pathname = url.parse(req.url).pathname;
		if (pathname.match(/.css|.js|.png|.jpg/) != null)
    	{
        	writeCSSJs(pathname,res);
    	}
    	else
    	{
    		ShowPagesByGet(str,res);
    	}
    }
}).listen(8000);

function getCSSJs(req,res)
{
    var pathname = url.parse(req.url).pathname;
    if (pathname.match(/.css|.js|.png|.jpg/) != null)
    {
        writeCSSJs(pathname,res);
    }
    else
    {
    	showpage(res);
    }
}
 
function writeCSSJs(pathname,res)
{
	fs.readFile("."+pathname, function(err,data) {
        if (err)
        {
            console.log('Read error!');
            throw err;
        }

        if (pathname.match(/.css/) != null)
        {
            res.writeHead(200, {"Content-Type": "text/css; charset = utf-8"});
        }

        if (pathname.match(/.js/) != null)
        {
            res.writeHead(200, {"Content-Type": "text/javascript; charset = utf-8"});
        }
        if (pathname.match(/.png/) != null)
        {
            res.writeHead(200, {"Content-Type": "application/x-png"});
        }
        if (pathname.match(/.jpg/) != null)
        {
            res.writeHead(200, {"Content-Type": "application/x-jpg"});
        }

    res.end(data);
    });
}

function getUser(req,res)
{
	var container = "";
	req.addListener("data",function(info){
		container += info;
	})
	req.addListener("end",function(){
		var user = querystring.parse(container);
		createUser(user,res);
	})
}

function createUser(user,res)
{
	fs.readFile('./userData.json', function(err, data){
            if(err){
                console.log('Read error!');
                throw err;
            }
            var allUser = JSON.parse(data);
            if (isRepeat(allUser,user) == "1")
            {
                console.log(isRepeat(allUser,user));
                allUser.push(user);
                var usertostring = JSON.stringify(allUser);
                writeToFile(usertostring);
                welcome(user,res);
                console.log("hi!");
            }
            else
            {
             	fs.readFile('./index.html', function(err, data){
                    if(err){
                        console.log('Read error!');
                        throw err;
                    }
                    var page = data.toString();
                    if (isRepeat(allUser,user) == "U")
                    {
                    	page = page.replace("nrepeat_dis", "nrepeat_show");
                    }
                    if (isRepeat(allUser,user) == "I")
                    {
                    	page = page.replace("irepeat_dis", "irepeat_show");
                    }
                    if (isRepeat(allUser,user) == "P")
                    {
                    	page = page.replace("prepeat_dis", "prepeat_show");
                    }
                    if (isRepeat(allUser,user) == "E")
                    {
                    	page = page.replace("erepeat_dis", "erepeat_show");
                    }
                    res.write(page);
                    res.end();
                    if (isRepeat(allUser,user) == "U")
                    {
                    	page = page.replace("nrepeat_show", "nrepeat_dis");
                    }
                    if (isRepeat(allUser,user) == "I")
                    {
                    	page = page.replace("irepeat_show", "irepeat_dis");
                    }
                    if (isRepeat(allUser,user) == "P")
                    {
                    	page = page.replace("prepeat_show", "prepeat_dis");
                    }
                    if (isRepeat(allUser,user) == "E")
                    {
                    	page = page.replace("erepeat_show", "erepeat_dis");
                    }
                });
            }
        })
}

function showpage(res)
{
	fs.readFile('./index.html',function(err,data){
		var page = data.toString();
		res.write(page);
		res.end();
	})
}

function welcome(user,res)
{
	 res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	 fs.readFile('./welcomepage.html', function(err,data){
	 	if (err) throw err;
	 	var page = data.toString();
	 	console.log("en?");
        page = page.replace("USER",user["username"]);
        page = page.replace("USER",user["username"]);
        page = page.replace("email",user["email"]);
        page = page.replace("xueshenghao",user["id"]);
        page = page.replace("phone",user["phone"]);
        res.write(page,function(err){res.end();});
        console.log("en2?");
	 })
}

function isRepeat(allUser,user)
{
	for (var i = 0; i <allUser.length; i++)
	{
		if (allUser[i].username == user["username"])
		{
            return "U";
        }
        if (allUser[i].id == user["id"])
        {
            return "I";
        }
        if (allUser[i].phone == user["phone"])
        {
            return "P";
        }
        if (allUser[i].email == user["email"])
        {
            return "E";
        }
	}
	return "1";
}

function ShowPagesByGet(param,res) {
	if (param.username != undefined) 
	{
		fs.readFile('./userData.json', function(error, data) {
			if (error) throw error;
			if (data == undefined || data == null || data.length == 0) 
			{
				data += "[]";
			}
			var users = JSON.parse(data);
			var user = findPerson(users, param.username);
			if (user == null) 
			{
				fs.readFile('./index.html', function(err, data){
                    if(err){
                        console.log('Read error!');
                        throw err;
                    }
                    var page = data.toString();
                    res.write(page);
                    res.end();
                });
				console.log("shit");
				
			} 
			else 
			{
				console.log("really?");
				welcome(user,res);
			}
		});
	} 
	else 
	{	
		
		console.log("hh");
		fs.readFile('./index.html', function(err, data){
                    if(err){
                        console.log('Read error!');
                        throw err;
                    }
                    var page = data.toString();
                    res.write(page);
                    res.end();
                });
	}
}
function findPerson(users, username) 
{
	for (var i = 0; i < users.length; i++) 
	{
		if (users[i].username == username) 
		{
			return users[i];
		}
	}
	return null;
}
function writeToFile(usertostring)
{
    fs.writeFile('./userData.json',usertostring, {flag: 'w',encoding: 'utf8'}, function (err) {
        if (err)
        {
            console.log("Write error!");
            throw err;
        }
        else
        {
            console.log("user");
        }
    });
}
