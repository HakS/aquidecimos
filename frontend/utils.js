import styled from "styled-components";

export const truncate = (input, limit) => input.length > limit ? `${input.substring(0, limit)}...` : input;

export const removeLastDot = (str) => {
  while(str.charAt(str.length-1) == '.') {
    str = str.substr(0, str.length-1);
  }
  return str;
}

export const Tooltip = styled.div`
  position:relative;
  &:after{
    content: attr(data-tip);
    font-size: .8rem;
    color: #fff;
    padding:5px 10px;
    border-radius: 6px;
    background: #565656;
    box-shadow: 0px 3px 4px rgba(0,0,0, .35);
    position: absolute;
    top: 27px;
    left: -10px;
    display:none;
  }
  &:before{
    z-index:1000;
    position:absolute;
    content:"";
    top:15px;
    left:0px;
    border-right:7px transparent solid;
    border-left:7px transparent solid;
    display:none;
  }
  &:hover{
    z-index:1000;
    position:relative;
    color:#8325f7;
    &:after{
      display: inline;
    }
  }
`
export const RelatedLink = styled.a`
  gap: 0.7rem;
  flex-basis: 100%;
  @media (min-width: 1024px) {
    min-width: calc(50% - 0.75rem);
    flex-basis: calc(50% - 0.75rem);
  }
`

export const currentDomain = process.env.URL || ''

export const getAbsUrl = (router) => `${currentDomain}${router ? (router.asPath === "/" ? "": router.asPath) : ''}`.split('?')[0]

// log the pageview with their URL
export const gtagPageView = (url) => {
  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  })
}

// log specific events happening.
export const gtagEvent = ({ action, params }) => {
  window.gtag('event', action, params)
}

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

export function urlQuerySerialize(obj) {
  const str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}
