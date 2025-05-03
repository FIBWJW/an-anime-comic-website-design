document.addEventListener('DOMContentLoaded', function() {
    // 从 localStorage 中获取用户名
    var username = localStorage.getItem('username');
    if (username) {
        // 将用户名显示在 nicknameDisplay 元素中
        document.getElementById('nicknameDisplay').textContent = '昵称：'+username;
    } else {
        // 如果没有找到用户名，重定向到登录页面
        window.location.href = 'login.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 从 localStorage 中获取用户名
    var username = localStorage.getItem('username');
    if (username) {
        // 请求服务器获取用户信息，包括签名
        fetch('/getUserInfo', {  // 修改为正确的路径 '/getUserInfo'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  // 显示签名
                  var signature = data.signature;
                  if (signature) {
                      localStorage.setItem('signature', signature); // 存储签名到本地
                      document.getElementById('signatureDisplay').textContent = '签名: ' + signature;
                  }
              } else {
                  alert('获取用户信息失败: ' + data.message);
              }
          }).catch(error => {
              console.error('Error:', error);
              alert('获取用户信息失败');
          });
    } else {
        // 如果没有找到用户名，重定向到登录页面
        window.location.href = 'login.html';
    }
});

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取用户名，假设从 localStorage 中获取
    const username = localStorage.getItem('username');

    // 发起获取头像请求
    fetch(`/api/get-avatar?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const avatarUrl = data.avatarUrl;
                // 更新页面上的头像
                const avatarImg = document.getElementById('avatar');
                avatarImg.src = avatarUrl;
            } else {
                // 处理未找到头像的情况，显示默认头像
                const avatarImg = document.getElementById('avatar');
                avatarImg.src = '../img/index/yonghu.png'; // 默认头像路径
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // 处理错误情况，显示默认头像
            const defaultAvatar = '../img/index/yonghu.png';
            const avatarImg = document.getElementById('avatar');
            avatarImg.src = defaultAvatar;
        });
});


// 添加修改密码功能
function showChangePasswordForm() {
    const formHtml = `
        <div id="changePasswordForm" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeChangePasswordForm()">&times;</span>
                <h2>修改密码</h2>
                <form id="changePassword">
                    <label for="oldPassword">旧密码:</label>
                    <input type="password" id="oldPassword" name="oldPassword" required>
                    <label for="newPassword">新密码:</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                    <label for="confirmNewPassword">确认新密码:</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required>
                    <button type="submit" onclick="submitChangePasswordForm(event)">提交</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

function closeChangePasswordForm() {
    const form = document.getElementById('changePasswordForm');
    if (form) {
        form.remove();
    }
}

function submitChangePasswordForm(event) {
    event.preventDefault();
    var username = localStorage.getItem('username');
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmNewPassword').value.trim();

    if (newPassword !== confirmPassword) {
        alert('新密码和确认密码不一致');
        return;
    }

    fetch('/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('密码修改成功');
              closeChangePasswordForm(); // 修改成功后关闭修改密码框
          } else {
              alert('密码修改失败: ' + data.message);
          }
      }).catch(error => {
          console.error('Error:', error);
          alert('密码修改失败');
      });
}

// 显示修改头像表单
function showChangeAvatarForm() {
    document.getElementById('changeAvatarForm').style.display = 'block';
}

// 关闭修改头像表单
function closeChangeAvatarForm() {
    document.getElementById('changeAvatarForm').style.display = 'none';
}

function submitChangeAvatarForm(event) {
    event.preventDefault();
    const form = document.getElementById('changeAvatarForm');
    const formData = new FormData();

    // 获取上传的文件
    const avatarFile = form.querySelector('input[type="file"]').files[0];

    // 假设从 localStorage 中获取用户名
    const username = localStorage.getItem('username');

    // 检查是否有文件上传
    if (!avatarFile) {
        alert('请选择要上传的头像文件！');
        return;
    }

    // 将用户名和文件路径作为对象传递给服务器
    const data = {
        username: username,
        avatarPath: avatarFile.name // 假设上传文件的名称作为路径
    };

    // 向服务器发送请求
    fetch('/api/upload-avatar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('头像上传成功！');
            closeChangeAvatarForm();
            // 更新页面上显示的头像
            document.getElementById('avatar').src = data.avatarUrl;
        } else {
            alert('头像上传失败，请重试。');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('头像上传失败，请重试。');
    });
}



// 显示修改签名表单
function showChangeSignatureForm() {
    document.getElementById('changeSignatureForm').style.display = 'block';
}

// 提交修改签名表单
function submitChangeSignatureForm(event) {
    event.preventDefault();
    var username = localStorage.getItem('username');
    var newSignature = document.getElementById('newSignature').value.trim();

    fetch('/changeSignature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            newSignature: newSignature
        })
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('签名修改成功');
              localStorage.setItem('signature', newSignature); // 更新本地存储的签名信息
              document.getElementById('signatureDisplay').textContent = '签名: ' + newSignature; // 更新页面显示
              document.getElementById('changeSignatureForm').style.display = 'none'; // 隐藏修改签名表单
          } else {
              alert('签名修改失败: ' + data.message);
          }
      }).catch(error => {
          console.error('Error:', error);
          alert('签名修改失败');
      });
}

function logout(){
        // 清除 cookie
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'signature=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // 重定向到登录页面
        window.location.href = 'login.html';
}
