exports.setCookie = (cname, cvalue) => {
    var host = location.host;
    let domainParts = host.split('.');
    domainParts.shift();
    let domain = '.'+domainParts.join('.');
    console.log('domain: '+domain);
    const d = new Date();
    let minutes = 5;
    d.setTime(d.getTime() + (minutes * 60));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; domain=" + domain;
}

exports.getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
  
exports.checkCookie = () => {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
        setCookie("username", user, 365);
        }
    }
}