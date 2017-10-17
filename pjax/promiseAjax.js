(function (window, factory) {
    if (typeof define === "function" && define.amd) {
        //AMD
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        //CMD
        module.exports = factory();
    } else {
        //window
        window.Pjax = factory();
    }

}(typeof window !== "undefined" ? window : this, function(){
    var Pjax = function(userOptions){
        let options = {
            url: "#",
            type: "GET",
            async: true,
            timeout: 0,
            dataType: 'text/json',
            headers: {},
            onprogress: function() {},
            onuploadprogress: function() {},
            xhr: null
        }

        let mergeOptions = function(userOptions, options){
			Object.keys(userOptions).forEach(function(key){
				options[key] = userOptions[key];
			});
        }
        
        let xhr = options.xhr || new XMLHttpRequest();

        return Promise((reslove, reject) => {
            xhr.open(options.type, options.url, options.async);

            //设置请求头
            for(let i in options.headers){
                xhr.setRequestHeader(i, options.header[i]);
            }

            //设置超时
            xhr.timeout = options.timeout;

            //设置onprogress
            xhr.onprogress = options.onprogress;

            //设置uplodonprogress
            xhr.upload.onprogress = options.onuploadprogress;

            //设置responseTypr
            xhr.responseType = options.dataType;

            //请求成功
            xhr.onloaded = function(){
                if(xhr.readyState === 4){
                    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                        reslove(xhr)
                    }else{
                        reject({
                            errorType: "status error",
                            xhr: xhr
                        })
                    }
                }
                
            };

            //发送数据
            try{
                xhr.send(options.data)
            }catch(e){
                reject({
                    errorType: "send data error",
                    xhr: xhr
                })
            };

            xhr.onabort = function(){
                reject({
                    errorType: "abort error",
                    xhr: xhr
                })
            }

            xhr.ontimeout = function(){
                reject({
                    errorType: "timeout error",
                    xhr: xhr
                })
            }

            xhr.onerror = function(){
                reject({
                    errorType: "xhr error",
                    xhr: xhr
                })
            }
        })

    }

    return Pjax
}))