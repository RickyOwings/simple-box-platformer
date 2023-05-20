export default function getSearchParams() {
  const location = document.location.toString();
  const params = new URL(location).searchParams;
  const getLevel = params.get("level");
  const level = getLevel ? parseInt(getLevel) : void 0;
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
