document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('pwd').value.trim();

    if (!username) {
        alert('用户名不能为空');
        return;
    }
    if (!password) {
        alert('密码不能为空');
        return;
    }

    // 提交表单数据到服务器
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('登录成功');
              // 登录成功后，你可以重定向到主页或其他页面
              localStorage.setItem('username', username);
              window.location.href = 'homepage.html';
          } else {
              alert('登录失败: ' + data.message);
          }
      }).catch(error => {
          console.error('Error:', error);
          alert('登录失败');
      });
});
