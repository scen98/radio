
export interface UrlParam{
    name: string;
    value : string;
}
export function getParameter(url: string): string{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return decodeURIComponent(urlParams.get(url));    
}

export function createUrl(url: string, params: UrlParam[]){
    let preparedUrl = url;
    if(params.length > 0){
        preparedUrl = setParams(preparedUrl, params);
    }
    return encodeURI(preparedUrl);
}

export function setParams(url: string, params: UrlParam[]){
    url += "?";
    for(let param of params) {
        url += `${param.name}=${encodeURIComponent(param.value)}`;
        if(param.name !== params[params.length - 1].name){
            url += "&";
        }
    }
    return url;
}

export function addParam(newParam: UrlParam){
    const splitUrl = window.location.href.split('?');
    if(splitUrl.length > 1){
        window.history.pushState("", "",  `${window.location.href}&${newParam.name}=${newParam.value}`);
    } else {
        window.history.pushState("", "",  `${window.location.href}?${newParam.name}=${newParam.value}`);
    }
}

export function changeParam(newParam: UrlParam){
    removeParam(newParam.name);
    addParam(newParam);
}

export function removeParam(parameter)
{
  var url=document.location.href;
  var urlparts= url.split('?');

 if (urlparts.length>=2)
 {
  var urlBase=urlparts.shift(); 
  var queryString=urlparts.join("?"); 

  var prefix = encodeURIComponent(parameter)+'=';
  var pars = queryString.split(/[&;]/g);
  for (var i= pars.length; i-->0;)               
      if (pars[i].lastIndexOf(prefix, 0)!==-1)   
          pars.splice(i, 1);
  url = urlBase+'?'+pars.join('&');
  window.history.pushState('',document.title,url); // added this line to push the new url directly to url bar .
}
}