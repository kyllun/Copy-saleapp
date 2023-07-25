function addToCart(id, name, price) {
    event.preventDefault() //Thẻ <a> sẽ chuyển hướng trang, để ngăn lại thì dùng hàm này

    //fetch() - Gửi request lên server (cụ thể là hàm add-to-cart() bên index.py thực hiện tiếp)
    //Tham số thứ 2 là 1 đối tượng JS. Trong đó:
    //Phương thức HTTP: 'post' => tạo một hành động mới -- thêm 1 sản phẩm vào giỏ hàng
    //body: chuyển đổi đối tượng chứa 'id', 'name', 'price' thành JSON (lý do tại sao data = request.json ở index.py)
    //header: chứa thông tin về kiểu dữ liệu được gửi đi -- dữ liệu được gửi đi sẽ là định dạng JSON
    //=> trình duyệt sẽ gửi một yêu cầu HTTP POST đến đường dẫn /api/add-cart (index.py)
    //với body yêu cầu được chuyển đổi thành chuỗi JSON
    //và tiêu đề được thiết lập để chỉ định kiểu dữ liệu được gửi đi.
    //Server sẽ nhận yêu cầu và xử lý nó để thêm sản phẩm được định nghĩa bởi các trường 'id', 'name' và 'price'
    //vào giỏ hàng của người dùng.
        fetch('/api/add-cart', {
        method: 'post',
        body: JSON.stringify({
            'id': id,
            'name': name,
            'price': price
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {  //Phương thức then() được sử dụng để "hứng" kết quả ở trên sau khi chạy xong
        console.info(res)    //In ra ở console (Inspect F12)
        return res.json()    //đối tượng Response - res đại diện cho kết quả trả về từ server
                             //sử dụng phương thức json() để trích xuất dữ liệu JSON từ kết quả trả về
    }).then(function(data) {
        console.info(data)

        //cập nhật số lượng sản phẩm trong giỏ hàng bằng cách cập nhật giá trị của phần tử có class="cart-counter".
        // vì là Elements nên cần duyệt qua
        let counter = document.getElementsByClassName('cart-counter')
        for (let i = 0; i < counter.length; i++)
            counter[i].innerText = data.total_quantity
    }).catch(function(err) {
        console.error(err)
    })
}

function pay() {
    if(confirm('Bạn chắc chắn có muốn thanh toán không?') == true) {
        fetch('/api/pay', {
            method: 'post',
        }).then(res => res.json()).then(data => {
            if(data.code == 200)
                location.reload()
        }).catch(err => console.error(err))
    }
}

//để obj thay vì quantity vì ở cart.html sử dụng this (giống như gọi hẳn cái input luôn, cho nên nếu cần truy cập
// quantity thì chỉ cần obj.value
function updateCart(id, obj) {
    fetch('/api/update-cart', {
        method: 'put',
        body: JSON.stringify({
            'id': id,
            'quantity': parseInt(obj.value)
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {

        let counter = document.getElementsByClassName('cart-counter')
        for (let i = 0; i < counter.length; i++)
            counter[i].innerText = data.total_quantity

        let amount = document.getElementById('total-amount')
        amount.innerText = new Intl.NumberFormat().format(data.total_amount)
//                         new Intl.NumberFormat().format(data.total_amount) dùng để định dạng số của data.total_amount
    })
}

function deleteCart(id) {
    if (confirm('Bạn chắc chắn muốn xoá sản phẩm này không?') == true) {
        fetch('/api/delete-cart/' + id, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {

            let counter = document.getElementsByClassName('cart-counter')
            for (let i = 0; i < counter.length; i++)
                counter[i].innerText = data.total_quantity

            let amount = document.getElementById('total-amount')
            amount.innerText = new Intl.NumberFormat().format(data.total_amount)
    //                         new Intl.NumberFormat().format(data.total_amount) dùng để định dạng số của data.total_amount

            let e = document.getElementById("product" + id)
            e.style.display = "none"

        }).catch(err => console.error(err))
    }
}

function addComment(productId) {
    let content = document.getElementById('commentId')
    if(content != null) {
        fetch('/api/comments', {
            method: 'post',
            body: JSON.stringify({
                'product_id': productId,
                'content': content.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            if(data.status == 201) {
                let c = data.comment //data.comment sẽ lấy cái 'comment': { 'id': c.id, 'content': c.content }

                let area = document.getElementById('commentArea')
                area.innerHTML = `
                    <div class="row">
                        <div class="col-md-1 col-xs-4">
                            <img src="${ c.user.avatar }" class="img-fluid rounded-circle" alt="demo" />
                        </div>
                        <div class="col-md-11 col-xs-8">
                            <p>${ c.content }</p>
                            <p><em>${ moment(c.created_date).locale('vi').fromNow() }</em></p>
                        </div>
                    </div>
                ` + area.innerHTML
                                //comment mới + comment cũ // tức là comment mới sẽ hiện lên trên comment cũ
                //area.innerHTML đại diện cho nguyên phần html nằm ở trong vùng <div id="commentArea">...</div>
            } else if (data.status == 404)
                alert(data.err_msg)
        })
    }
}