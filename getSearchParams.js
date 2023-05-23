import Cookie from "./_snowpack/pkg/js-cookie.js";
const levelCookie = Cookie.get("level");
const levelCookieInt = levelCookie ? parseInt(levelCookie) : void 0;
export default function getSearchParams() {
  const location = document.location.toString();
  const params = new URL(location).searchParams;
  const getLevel = params.get("level");
  let level = getLevel ? parseInt(getLevel) : void 0;
  level = level === void 0 ? levelCookieInt : level;
  const getCustomLevel = params.get("customLevel");
  const customLevelJSON = getCustomLevel ? JSON.parse(getCustomLevel) : void 0;
  let isRightType = true;
  try {
    const mapArr = customLevelJSON.mapArr;
    for (let y in mapArr) {
      if (!isRightType)
        break;
      for (let x in mapArr[y]) {
        if (typeof mapArr[y][x] != "number") {
          isRightType = false;
          break;
        }
      }
    }
  } catch (err) {
    isRightType = false;
  }
  const customLevel = isRightType ? customLevelJSON : void 0;
  console.log(customLevel);
  return {
    level,
    customLevel
  };
}
