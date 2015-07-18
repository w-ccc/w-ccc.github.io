var Ref=new Firebase("https://fiery-torch-9879.firebaseio.com/");
var messagesRef=Ref.child("text");
var userRef=Ref.child("user");
var usernameList=[];
var roomList=[];
var currentUsername="";
var currentRoom="Chatroom1";
$("#roomName").html("<p class='roomListElem'>"+currentRoom+"</p>");
var messageInput=$("#messageInput");
var nameInput=$("#nameInput");

//提交要发出的消息时的判断函数，其中包含对消息内容是否为空和昵称是否合法的判断
messageInput.keypress(function(e){
	if(e.keyCode==13){
		var name=nameInput.val();
		if(name=="匿名用户")
		{
			alert("昵称不能为匿名用户");
			return;
		}
		if(currentUsername!=name&&name!="")
		{
			for(var i=0;i<usernameList.length;i++)
			{
				if(name==usernameList[i])
				{
					alert("该昵称已被使用，请换一个新的昵称~");
					return;
				}
				if(currentUsername==usernameList[i])
					usernameList[i]=null;
			}
			if(currentUsername)
				userRef.push({name:currentUsername,room:currentRoom,state:false});
			currentUsername=name;
			userRef.push({name:name,room:currentRoom,state:true});
		}
		var message=messageInput.val();
		messageInput.val("");
		if(message=="")
		{
			alert("输入不能为空");
			return;
		}
		messagesRef.push({name:name,text:message,room:currentRoom});
		
	}
})

//消息数据库内容增加时的响应函数
messagesRef.on("child_added",addData);
function addData(snapshot){
	var data=snapshot.val();
	var username=data.name||"匿名用户";
	var message=data.text;
	var room=data.room;
	if(room==currentRoom)
	{
		displayMessage(username,message);
	}
	displayRoom(room);
}

//显示中央消息列表
function displayMessage(username,message){
	if(message=="")
		return;
	var textDiv=$("<div></div>").html("<p class='singleText'>"+message+"</p>");
	textDiv.attr("class","singleText");
	var userDiv=$("<div></div>").html("<p class='singleUser'>"+username+"</p>");
	userDiv.attr("class","singleUser");
	var blandDiv=$("<div class='blank'></div>");
	var msgDiv=$("<div><br/></div>").append(userDiv,textDiv,blandDiv);
	msgDiv.attr("class","singleMessage");
	$("#MessageField").append(msgDiv);
	$("#MessageField")[0].scrollTop=$("#MessageField")[0].scrollHeight;
}

//用户数据库内容增加时的响应函数
userRef.on("child_added",addUser);
function addUser(snapshot){
	var data=snapshot.val();
	var username=data.name;
	var state=data.state;
	var room=data.room;
	if(room==currentRoom)
		displayUsername(username,state);
}

//显示右侧用户名列表
function displayUsername(username,state){
	for(var i=0; i<usernameList.length;i++)
	{
		if(username==usernameList[i])
		{
			if(!state){
				usernameList[i]=null;
			}
			else
				return;
		}
	}
	if(state)
		usernameList[i]=username;
	$("#userList").empty();
	var usernameDiv;
	for(var i = 0; i < usernameList.length;i++)
	{
		if(usernameList[i])
		{
			usernameDiv=$("<div class='usernameListElem'></div>").html("<p class='usernameListElem'>"+usernameList[i]+"</p>");
			$("#userList").append(usernameDiv);
		}
	}
	
}

//窗口关闭时的事件处理
window.onunload=function(){
	if(currentUsername)
		userRef.push({name:currentUsername,room:currentRoom,state:false});
}

//显示左侧房间列表
function displayRoom(room){
	for(var i=0;i<roomList.length;i++)
	{
		if(room==roomList[i])
			return;
	}
	var roomDiv=$("<div class='roomListElem'></div>").html("<p class='roomListElem'>"+room+"</p>");
	roomDiv.click(clickRoom);
	roomList[i]=room;
	$("#addRoom").before(roomDiv);
}

//增加房间按钮的点击事件处理
$("#addRoom").click(function(){
	messagesRef.push({name:"",text:"",room:"Chatroom"+(roomList.length+1)});
});

//点击其他房间时的事件处理
function clickRoom(){
	if(currentRoom==this.children[0].innerText)
		return;
	if(currentUsername)
		userRef.push({name:currentUsername,room:currentRoom,state:false});
	currentRoom=this.children[0].innerText;
	$("#roomName").html("<p class='roomListElem'>"+currentRoom+"</p>");
	currentUsername=null;
	nameInput.val("");
	usernameList=[];
	$("#MessageField").empty();
	$("#userList").empty();
	Ref=new Firebase("https://fiery-torch-9879.firebaseio.com/");
	messagesRef.off("child_added",addData);
	userRef.off("child_added",addUser);
	messagesRef=new Firebase("https://fiery-torch-9879.firebaseio.com/text");
	userRef=new Firebase("https://fiery-torch-9879.firebaseio.com/user");
	messagesRef.on("child_added",addData);
	userRef.on("child_added",addUser);
}