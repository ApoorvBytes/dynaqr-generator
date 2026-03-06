let qr;

function generateQR(){

let container = document.getElementById("qrCode");
container.innerHTML = "";

let text = document.getElementById("qrText").value;
let color = document.getElementById("qrColor").value;
let size = document.getElementById("qrSize").value;

if(text===""){
alert("Enter text or URL");
return;
}

qr = new QRCode(container,{
text:text,
width:size,
height:size,
colorDark:color,
colorLight:"#ffffff"
});

}

document.getElementById("downloadBtn").addEventListener("click",()=>{

let img = document.querySelector("#qrCode img");

if(!img){
alert("Generate QR first");
return;
}

let link = document.createElement("a");

link.href = img.src;
link.download = "qr-code.png";

link.click();

});