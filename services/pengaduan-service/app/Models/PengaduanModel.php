<?php

namespace App\Models;

use CodeIgniter\Model;

class PengaduanModel extends Model
{
    protected $table            = 'pengaduan';
    protected $primaryKey       = 'id';
    protected $allowedFields    = ['judul', 'deskripsi', 'kategori', 'status', 'rating', 'user_id'];
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    // buat validas input
    protected $validationRules = [
        'judul'     => 'required|min_length[5]',
        'deskripsi' => 'required|min_length[10]',
        'kategori'  => 'required|in_list[akademik,non-akademik]',
        'user_id'   => 'required|integer',
    ];

    protected $validationMessages = [
        'judul' => [
            'required'   => 'Judul wajib diisi',
            'min_length' => 'Judul minimal 5 karakter',
        ],
        'deskripsi' => [
            'required'   => 'Deskripsi wajib diisi',
            'min_length' => 'Deskripsi minimal 10 karakter',
        ],
        'kategori' => [
            'required' => 'Kategori wajib diisi',
            'in_list'  => 'Kategori harus akademik atau non-akademik',
        ],
    ];
}