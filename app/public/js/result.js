document.addEventListener("DOMContentLoaded", function() {
    const searchResultTitle = document.getElementById('search-result-title');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    if (query) {
        searchResultTitle.textContent = `根据关键字：'${query}' 的搜索结果`;
    } else {
        searchResultTitle.textContent = '没有提供搜索关键字';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.site-search form');
    const searchText = document.querySelector('.site-search .search-text');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止默认表单提交行为

        if (searchText.value.trim() === '') {
            alert('请输入关键字');
        } else {
            // 如果输入不为空，跳转到结果页面，并传递搜索关键词作为查询参数
            window.location.href = `result.html?query=${encodeURIComponent(searchText.value.trim())}`;
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const searchResultTitle = document.getElementById('search-result-title');
    const searchResults = document.getElementById('search-results');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    if (query) {
        searchResultTitle.textContent = `根据关键字：'${query}' 的搜索结果`;

        fetch(`/search?query=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    searchResults.innerHTML = '<p>没有找到匹配的结果</p>';
                } else {
                    const resultList = document.createElement('ul');
                    resultList.classList.add('comic-list'); // 添加类名以便样式化
                    data.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('comic-item'); // 添加类名以便样式化
                        listItem.innerHTML = `
                            <a href="${item.html}">
                                <img src="${item.img}" alt="${item.name}">
                                <div>${item.name}</div>
                            </a>
                        `;
                        resultList.appendChild(listItem);
                    });
                    searchResults.appendChild(resultList);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                searchResults.innerHTML = '<p>搜索过程中出现错误</p>';
            });
    } else {
        searchResultTitle.textContent = '没有提供搜索关键字';
    }
});




