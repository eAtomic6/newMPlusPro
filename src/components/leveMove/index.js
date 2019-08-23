import LeftMove from './leftMove'

function init(vue) {
    console.log("444444");
    console.log(LeftMove);
  vue.directive('LeftMove', LeftMove);
}


export default {
  init: init
}
