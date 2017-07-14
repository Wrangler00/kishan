var socket = io();

var firstName,lastName,phone;

function firstBtn(){
	socket.emit("first tab clicked",true);
}

function secondBtn(){
	socket.emit("Second tab clicked",true);
}

socket.on("contacts json",function(data){
	//console.log(data);

	document.getElementById("splashId").style.display="none";
	document.getElementById("godListId").style.display="block";

	var uli = document.getElementById('contactUlId');
	for(var i=0;i<data.length;i++){
		var bi = document.createElement('li');
		bi.id=data[i].id;
		bi.style.cursor="pointer";
		var p1 = document.createElement('p');
		p1.innerHTML = data[i].firstName+" "+data[i].lastName;
		p1.style.color = "orange";
		p1.style.fontSize = "40px";
		bi.appendChild(p1);
		uli.appendChild(bi);

		bi.addEventListener("click",function(e){
			//console.log(this.id);
			document.getElementById("contacts-ListId").style.display="none";
			document.getElementById("infoPageId").style.display="block";

			var info = document.getElementById("infoId");
			var sndBtn =  document.getElementById("sendMsgId");

			var h1 = document.createElement('h1');
			var h2 = document.createElement('h2');
			var btn1 = document.createElement('button');

			//h1.style.color = "orange";
			//h2.style.color = "orange";
			btn1.className += "btn btn-green";
			btn1.innerHTML = "SEND MESSAGE";

			for(var j=0;j<data.length;j++){
				if(this.id === data[j].id){
					
					firstName = data[j].firstName;
					lastName = data[j].lastName;
					phone = data[j].phone;

					h1.innerHTML = data[j].firstName+" "+data[j].lastName;
					h2.innerHTML = data[j].phone;
					break;
				}
			}

			info.appendChild(h1);
			info.appendChild(h2);
			sndBtn.appendChild(btn1);
		});
	}

	document.getElementById("sendMsgId").addEventListener("click",function(e){
		
		if(e.target && e.target.nodeName == "BUTTON"){
			//window.location = "location:3000/firstTab";
			//console.log("send MESSAGE clicked");
			document.getElementById("infoPageId").style.display = "none";

			var newMsgPage = document.getElementById("newMsgId");
			var formMsg = document.getElementById("msgForm");
			var emptyId = document.createElement("input");
			emptyId.type = "hidden";
			emptyId.name = "password";
			emptyId.value = phone;

			formMsg.appendChild(emptyId);
			newMsgPage.style.display = "block";
		}
	});
});

socket.on("sentMessages",function(result){
	console.log(result);
	
	document.getElementById("splashId").style.display = "none";
	
	/*for (var key in result) {
		console.log(key);
	  if (result.hasOwnProperty(key)) {
	    //console.log(key + " -> " + result[key]);
	    var ull = document.getElementById("sentMsgUlId");
		var lii = document.createElement("li");
		lii.id=result[key]._id;

		var h11 = document.createElement("h1");
		h11.innerHTML = result[key].name;
		h11.style.color = "orange";

		var h22 = document.createElement("h2");
		h22.innerHTML = result[key].time;
		h22.style.color = "orange";

		var h222 = document.createElement("h2");
		h222.innerHTML = result[key].OTP;
		h222.style.color = "orange";

		lii.appendChild(h11);
		lii.appendChild(h22);
		lii.appendChild(h222);

		ull.appendChild(lii);
	  }
	}*/

	for(var i=0;i<result.length;i++){
		
		var ull = document.getElementById("sentMsgUlId");
		var lii = document.createElement("li");
		lii.id=result[i]._id;

		var h11 = document.createElement("h1");
		h11.innerHTML = "NAME: "+result[i].name;
		h11.style.color = "orange";

		var h22 = document.createElement("h1");
		h22.innerHTML = "TIME: "+result[i].time;
		h22.style.color = "orange";

		var h222 = document.createElement("h1");
		h222.innerHTML = "OTP: "+result[i].OTP;
		h222.style.color = "orange";

		lii.appendChild(h11);
		lii.appendChild(h22);
		lii.appendChild(h222);

		ull.appendChild(lii);
	}

	document.getElementById("godListId2").style.display = "block";
});