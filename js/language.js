// 定义支持的语言列表
const langList = ['en','zh_CN'];
// 语言切换
function changeLang(obj){
  // 切换时的显示样式
  $(obj).addClass('active').siblings().removeClass('active');
  let currentLang = $(obj).attr("id");
  // 判断选择的语言是不是在支持的列表内
  if(contains(langList,currentLang)){
    // 传入选中的语言，重新加载国际化资源文件
    loadProperties(currentLang);
  }else{
    console.log('该语言:'+currentLang+', 不在定义的列表内');
  }
}

// 加载国际化文件
function loadProperties(lang){
  var newLang = "";
  // 点击语言切换时
  if(lang){
    // 获取cookie或浏览器中的语言
    newLang = $.i18n.normaliseLanguageCode({
      language: lang,
    });
    cookies.setCookie('lang',lang);
  // 初始化页面加载时
  }else{
    // 如果cookie中没有则获取浏览器的语言
    newLang = $.i18n.normaliseLanguageCode({
      language: cookies.getCookie('lang')?cookies.getCookie('lang'):'',
    });
    // 如果cookie里没有则将浏览器的语言设进cookie
    if(!cookies.getCookie('lang')){
      cookies.setCookie('lang',newLang);
    }
    // 页面上显示对应的语言标志
    $('.lang[id='+newLang+']').addClass("active").siblings().removeClass("active");
  }
  //console.log(newLang);
  $.i18n.properties({
     name: 'messages',      // 资源文件名称
     path: 'i18n/lang/',    // 资源文件所在目录路径
     mode: 'both',          // 模式：变量或 Map，默认为vars
     language: newLang,     // 对应的语言,默认对应浏览器语言
     cache: false,          // 不使用缓存
     encoding: 'UTF-8',     // 编码
     callback: function() { // 回调方法，对应的国际化文件加载完毕后执行相应的代码
       // 遍历需要翻译的地方
       $(".i18n").each(function(i){
         $(this).text($.i18n.prop($(this).attr("name")));
       });
     }
  });
}

// cokies工具类
let cookies = {
  setCookie: function(key,value){
    /*当前日期*/
    var today = new Date();
    /*Cookie过期时间*/
    var expire = new Date();
    /*如果未设置nDays参数或者nDays为0，取默认值1*/
    //if(nDays == null || nDays == 0) nDays = 1;
    /*计算Cookie过期时间【 3600000 * 24 为一天】*/
    expire.setTime(today.getTime() + 400000); //5分钟
    document.cookie = key + "=" + escape(value) + ";expires=" +   expire.toGMTString();
  },
  getCookie: function(key){
    var theCookie = "" + document.cookie;
    var ind = theCookie.indexOf(key);
    if(ind==-1 || key=="") return "";
    var ind1 = theCookie.indexOf(';',ind);
    if(ind1==-1) ind1 = theCookie.length;
    /*读取Cookie值*/
    return unescape(theCookie.substring(ind+key.length+1,ind1));
  },
  removeCookie: function(key){
    var myDate = new Date();
    myDate.setTime(-1000);//设置时间
    document.cookie = key + "=''; expires="+myDate.toGMTString();
  }
}

// 判断元素是否在数组中
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
      if (arr[i] === obj) {
          return true;
      }
  }
  return false;
}
