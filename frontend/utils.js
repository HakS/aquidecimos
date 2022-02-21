export const truncate = (input, limit) => input.length > limit ? `${input.substring(0, limit)}...` : input;

export const removeLastDot = (str) => {
  while(str.charAt(str.length-1) == '.') {
    str = str.substr(0, str.length-1);
  }
  return str;
}

export const getAbsoluteUrl = (function() {
	var a;
	return function(url) {
		if(!a) a = document.createElement('a');
		a.href = url;
		return a.href;
	};
})();