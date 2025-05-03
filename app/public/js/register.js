document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var password = document.getElementById('pwd').value.trim();
    var confirmPassword = document.getElementById('pwd2').value.trim();

    if (!username) {
        alert('用户名不能为空');
        return;
    }
    if (username.length < 1 || username.length > 10) {
        alert('用户名长度应为1到10位');
        return;
    }
    if (!phone) {
        alert('手机号不能为空');
        return;
    }
    var phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
        alert('手机号应为11位数字');
        return;
    }
    if (!password) {
        alert('密码不能为空');
        return;
    }
    if (password.length < 6 || password.length > 15) {
        alert('密码长度应为6到15位');
        return;
    }
    if (password !== confirmPassword) {
        alert('密码和确认密码不匹配');
        return;
    }

    // 提交表单数据到服务器
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            phone: phone,
            password: password
        })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('注册成功');
              window.location.href = 'login.html';
          } else {
              alert('注册失败: ' + data.message);
          }
      }).catch(error => {
          console.error('Error:', error);
          alert('注册失败');
      });
});

document.addEventListener('mousemove', function(e) {
    const moveX = e.clientX / 20;
    const moveY = e.clientY / 20;
    document.body.style.backgroundPosition = moveX + 'px ' + moveY + 'px';
});