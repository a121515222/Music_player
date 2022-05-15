import variables,* as dom from './dom';
import {watchPlaylistForDragAndDrop} from  './dargAndDrop';

// 在播放狀態自動對照id與presentSongIndex
export function songIdMatchIndex() {
  variables.songsList.forEach((i, index) => {
      if (i.snippet.resourceId?.videoId === variables.player.getVideoData().video_id) {
        variables.presentSongIndex = index
      } else if (i.id.videoId === variables.player.getVideoData().video_id) {
        variables.presentSongIndex = index
      }
    })
}

// 顯示歌單
export function showSongList() {
  let result = "";
  variables.songsList.forEach((i, index) => {
    result += `<li draggable="true"><a class="songList dropdown-item d-inline-block text-truncate" 
    data-index=${index} data-vid=${i.snippet.resourceId.videoId} href="#">${i.snippet.title}</a></li>`;
  });
  dom.playlists.innerHTML = result;
  variables.songListLi = document.querySelectorAll(".songList");
  variables.songListLength = variables.songListLi.length;
  variables.songListLi.forEach((i) => {
    i.setAttribute('data-disabled', true)
    i.setAttribute('style', 'cursor: not-allowed;')
    setTimeout(() => {
      i.setAttribute('data-disabled', false)
      i.removeAttribute('style', 'cursor: not-allowed;')  
    },300);
  })
  watchPlaylistForDragAndDrop()
}

// 顯示搜尋歌單
export function showSearchSongList() {
  if(dom.inputInfo.value !== ''){
    let result = "";
    variables.searchResultId = [];
    variables.searchResult.forEach((i, index) => {
      result += `<li draggable="true"><a class="searchResultItem dropdown-item d-inline-block text-truncate p-2" data-index=${index} data-vid=${i.id.videoId} href="#">${i.snippet.title}</a></li>`
      variables.searchResultId.push(i.id.videoId)
    });
    dom.searchResults.innerHTML = result;
    variables.searchResultLi = document.querySelectorAll(".searchResultItem");
    dom.searchResults.classList.remove('d-none');
    variables.player.loadPlaylist(variables.searchResultId, 0, 0);
    setTimeout(() => {
    variables.player.pauseVideo();
    }, 500);
  }
}

// 增加播放中focus效果，不是播放中則移除。
export function addOrRemoveMusicPlaying(dataList = variables.songListLi) {
dataList.forEach((i,index) => {
  if (Number(i.dataset.index) === variables.presentSongIndex) {
    dataList[index].classList.add('musicPlaying');
  } else {
    dataList[index].classList.remove('musicPlaying');
  }
})
}

// 歌單重新排序
export function songListSort(){
  let shuffle = []
  variables.songsList.forEach((i, index) => {
  // 因為歌單的來源有兩種search與playlist，兩包的資料不太一樣。
  if (i.snippet.resourceId.videoId !== undefined) {
    const songIndex = variables.songsListId.indexOf(i.snippet.resourceId.videoId);
    shuffle.splice(songIndex, 0, variables.songsList[index])
  } else {
    const songIndex = variables.songsListId.indexOf(i.id.videoId);
    shuffle.splice(songIndex, 0, variables.songsList[index])
  }  
});
variables.songsList = shuffle ;
showSongList();
showSongImg();
showSongInfo();
addOrRemoveMusicPlaying();
};