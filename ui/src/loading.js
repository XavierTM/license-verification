
import { Loading } from 'notiflix/build/notiflix-loading-aio';


function showLoading() {
    Loading.circle();
}


function hideLoading() {
    Loading.remove();
}



export {
    hideLoading,
    showLoading
}