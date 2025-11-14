CREATE DATABASE quan_li_web_xem_phim;

create DATABASE IF not EXISTS quan_ly_web_phim;

1. thể loại
    - id int primary key
    - ten_the_loai varchar(50)
2. người dùng
    - id int
    - ten_dang_nhap varchar(50)
    - matKhau varchar(50)
    - ho_ten varchar(50)
    - email varchar(50)
    - sdt varchar(10)
    - vai_tro_id int 
    - ngay_sinh datetime
3. vai_tro
    - id int
    - ten_vai_tro varchar(20)
4. phim
    - id int primary key
    - ten_phim varchar
    - dao_dien_id int
    - nam_phat_hanh int
    - poster varchar
    - quoc_gia_id int
    - so_tap int
    - trailer varchar
    - mo_ta text
5. phim_dien_vien
    - id int
    - phim_id int
    - dien_vien_id int
6. phim_the_loai
    - id int
    - phim_id int
    - the_loai_id int
7. quốc gia
    -id int
    -ten_quoc_gia varchar
5. Tập phim
    - id int
    - so_tap int
    - tieu_de varchar
    - phim_id int
    - thoiLuong float 
    - trailer varchar