document.addEventListener('DOMContentLoaded', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/comics/rankings');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var ul = document.querySelector('.section ul');
            ul.innerHTML = ''; // 清空现有列表
            if (data && data.length > 0) {
                data.forEach(function(comic, index) {
                    var li = document.createElement('li');
                    li.classList.add('ranking-item');
                    li.innerHTML = `<span class="rank">${index + 1}</span>
                                    <span class="name">${comic.name}</span>
                                    <span class="click-count">${comic.click_count}</span>`;
                    ul.appendChild(li);
                });
            } else {
                ul.innerHTML = '<li>暂无数据</li>';
            }
        } else {
            console.error('Error fetching rankings:', xhr.statusText);
            var ul = document.querySelector('.section ul');
            ul.innerHTML = '<li>数据加载失败</li>';
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
});
