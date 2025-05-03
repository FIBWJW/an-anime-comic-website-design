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
