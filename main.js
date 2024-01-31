const url = `https://api.thecatapi.com/v1/images/search?limit=20`;
const api_key = "live_mT6n1IDzYlvzYwdlG1zBfnSSQKQHNNgJPBhsj2AgtA94UuY8GtJkTI4Cp8BdLcND"
const heart_line = "M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z";
const heart_svg = './heart.svg';
let countLoad = 0;
let data = [];
let likedCats = [];

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
}


function doCatLiked() {
    let color = this.getAttribute('fill');
    if (color == 'rgba(255, 58, 0, 1)') {
        let removeCat = this.parentNode.parentNode.firstChild;
        let srcRemoveCat = removeCat.getAttribute('src');
        this.setAttribute('fill', 'none');
        this.firstChild.setAttribute('stroke', '#f24e1e');
        let res = likedCats.findIndex((item) => {
            return item == srcRemoveCat
        });
        likedCats.splice(res, 1);
        document.cookie = `likedCats=${likedCats}`;
    } else {
        this.setAttribute('fill', 'rgba(255, 58, 0, 1)');
        this.firstChild.setAttribute('stroke', 'rgba(255, 58, 0, 1)');
        likedCats.push(this.parentNode.parentNode.firstChild.getAttribute('src'));
        document.cookie = `likedCats=${likedCats}`;
    }
}

async function loadCats() {
    document.getElementById('load-button').removeEventListener('click', loadCats);
    countLoad++;
    try {
        let response = await fetch(url, { headers: { 'x-api-key': api_key } });
        let currentData = await response.json();
        for (let i = 0; i < currentData.length; i++) {
            let imageData = currentData[i];
            data.push(currentData[i]);
            if (i % 5 == 0) {
                let row = document.createElement('div');
                row.classList.add('row');
                row.id = `row-${Math.floor((20 * countLoad + i) / 5)}`
                document.getElementById('grid').appendChild(row);
            }
            let image = document.createElement('img');
            image.src = `${imageData.url}`;

            let heartContainer = document.createElement('div');
            heartContainer.classList.add('heart-container');

            let heart = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            heart.setAttribute('width', "40px");
            heart.setAttribute('height', "40px");
            heart.setAttribute('viewBox', "0 0 24 24");
            heart.setAttribute('fill', "none");
            heart.setAttribute('xmlns', "http://www.w3.org/2000/svg");
            heart.classList.add('svgimg');
            heart.addEventListener('click', doCatLiked);

            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute('fill-rule', 'evenodd');
            path.setAttribute('clip-rule', 'evenodd');
            path.setAttribute('d', heart_line);
            path.setAttribute('stroke', '#f24e1e');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');

            heart.appendChild(path);

            heartContainer.appendChild(heart);

            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.appendChild(image);
            cell.appendChild(heartContainer);

            let cellBorber = document.createElement('div');
            cellBorber.classList.add('cell-border');

            let cellContainer = document.createElement('div');
            cellContainer.classList.add('cell-container');
            cellContainer.appendChild(cell);
            cellContainer.appendChild(cellBorber);
            document.getElementById(`row-${Math.floor((20 * countLoad + i) / 5)}`).appendChild(cellContainer);
        }
        document.getElementById('load-button').addEventListener('click', loadCats);
    } catch (err) {
        console.log(err);
    }
}

function LikedPage() {
    let cookies = getCookie('likedCats').split(',');
    document.getElementById('grid2').innerHTML = '';
    document.getElementById('grid').style.display = 'none';
    document.getElementById('button-container').style.display = 'none';
    document.getElementById('grid2').style.display = 'block';
    document.getElementById('liked_cats').classList.add('active_page');
    document.getElementById('all_cats').classList.remove('active_page');
    if (cookies.length == 1 && cookies[0] == '') return;
    for (let i = 0; i < cookies.length; i++) {
        if (i % 5 == 0) {
            let row = document.createElement('div');
            row.classList.add('row');
            row.id = `row-liked-${Math.floor((20 * countLoad + i) / 5)}`
            document.getElementById('grid2').appendChild(row);
        }
        let likedPicture = data.findIndex(item => {
            return String(item.url) == String(cookies[i]);
        });
        let image = document.createElement('img');
        image.src = `${data[likedPicture].url}`;

        let heartContainer = document.createElement('div');
        heartContainer.classList.add('heart-container');

        let heart = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        heart.setAttribute('width', "40px");
        heart.setAttribute('height', "40px");
        heart.setAttribute('viewBox', "0 0 24 24");
        heart.setAttribute('fill', "rgba(255, 58, 0, 1)");
        heart.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        heart.classList.add('svgimg');
        heart.addEventListener('click', doCatLiked);

        let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
        path.setAttribute('d', heart_line);
        path.setAttribute('stroke', 'rgba(255, 58, 0, 1)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        heart.appendChild(path);

        heartContainer.appendChild(heart);

        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.appendChild(image);
        cell.appendChild(heartContainer);

        let cellBorber = document.createElement('div');
        cellBorber.classList.add('cell-border');

        let cellContainer = document.createElement('div');
        cellContainer.classList.add('cell-container');
        cellContainer.appendChild(cell);
        cellContainer.appendChild(cellBorber);
        document.getElementById(`row-liked-${Math.floor((20 * countLoad + i) / 5)}`).appendChild(cellContainer);
    }
}

function StartPage() {
    cookies = getCookie('likedCats').split(',');
    document.getElementById('grid').innerHTML = '';
    document.getElementById('grid').style.display = 'block';
    document.getElementById('button-container').style.display = 'flex';
    document.getElementById('grid2').style.display = 'none';
    document.getElementById('all_cats').classList.add('active_page');
    document.getElementById('liked_cats').classList.remove('active_page');
    for (let i = 0; i < data.length; i++) {
        let imageData = data[i];
        let isLaked = cookies.includes(imageData.url);
        if (i % 5 == 0) {
            let row = document.createElement('div');
            row.classList.add('row');
            row.id = `row-${Math.floor((20 * countLoad + i) / 5)}`
            document.getElementById('grid').appendChild(row);
        }
        let image = document.createElement('img');
        image.src = `${imageData.url}`;

        let heartContainer = document.createElement('div');
        heartContainer.classList.add('heart-container');

        let heart = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        heart.setAttribute('width', "40px");
        heart.setAttribute('height', "40px");
        heart.setAttribute('viewBox', "0 0 24 24");
        if (isLaked){
            heart.setAttribute('fill', "rgba(255, 58, 0, 1)");
        }else{
            heart.setAttribute('fill', "none");
        }
        heart.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        heart.classList.add('svgimg');
        heart.addEventListener('click', doCatLiked);

        let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
        path.setAttribute('d', heart_line);
        if (isLaked){
            path.setAttribute('stroke', 'rgba(255, 58, 0, 1)');
        }else{
            path.setAttribute('stroke', '#f24e1e');
        }
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        heart.appendChild(path);

        heartContainer.appendChild(heart);

        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.appendChild(image);
        cell.appendChild(heartContainer);

        let cellBorber = document.createElement('div');
        cellBorber.classList.add('cell-border');

        let cellContainer = document.createElement('div');
        cellContainer.classList.add('cell-container');
        cellContainer.appendChild(cell);
        cellContainer.appendChild(cellBorber);
        document.getElementById(`row-${Math.floor((20 * countLoad + i) / 5)}`).appendChild(cellContainer);
    }
}

loadCats();
document.getElementById('liked_cats').addEventListener('click', LikedPage);
document.getElementById('all_cats').addEventListener('click', StartPage);
document.getElementById('load-button').addEventListener('click', loadCats);
