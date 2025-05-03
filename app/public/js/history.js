document.addEventListener("DOMContentLoaded", function() {
    const comicLinks = document.querySelectorAll('.history-record-info h3 a');

    comicLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认的点击行为

            const html = this.href; // 获取动漫详情页面的路径

            // 发送 POST 请求记录浏览历史
            fetch('/record-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ html })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to record browsing history');
                }
                // 跳转到动漫详情页面
                window.location.href = html;
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    });
});
