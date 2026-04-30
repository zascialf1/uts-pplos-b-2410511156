<?php

namespace App\Controllers;

use App\Models\PengaduanModel;
use CodeIgniter\HTTP\ResponseInterface;

class PengaduanController extends BaseController
{
    protected $model;

    public function __construct()
    {
        $this->model = new PengaduanModel();
    }

    // get buat ambil semua data w paginf n filter
    public function index()
    {
        $page     = $this->request->getGet('page') ?? 1;
        $perPage  = $this->request->getGet('per_page') ?? 10;
        $kategori = $this->request->getGet('kategori');
        $status   = $this->request->getGet('status');

        $builder = $this->model->builder();

        if ($kategori) {
            $builder->where('kategori', $kategori);
        }
        if ($status) {
            $builder->where('status', $status);
        }

        $total = $builder->countAllResults(false);
        $data  = $builder->get(($perPage), ($page - 1) * $perPage)->getResultArray();

        return $this->response->setJSON([
            'status' => 'sukses',
            'total'  => $total,
            'page'   => (int)$page,
            'per_page' => (int)$perPage,
            'data'   => $data,
        ]);
    }

    // get data by id
    public function show($id)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Pengaduan tidak ditemukan',
            ]);
        }
        return $this->response->setJSON(['status' => 'sukses', 'data' => $data]);
    }

    // post data baru
    public function create()
    {
        $input = $this->request->getJSON(true);

        if (!$this->model->validate($input)) {
            return $this->response->setStatusCode(422)->setJSON([
                'status'  => 'error',
                'message' => $this->model->errors(),
            ]);
        }

        $id = $this->model->insert($input);
        $data = $this->model->find($id);

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => 'sukses',
            'message' => 'Pengaduan berhasil dibuat',
            'data'    => $data,
        ]);
    }

    // put update data by id
    public function update($id)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Pengaduan tidak ditemukan',
            ]);
        }

        $input = $this->request->getJSON(true);
        $this->model->update($id, $input);

        return $this->response->setJSON([
            'status'  => 'sukses',
            'message' => 'Pengaduan berhasil diupdate',
            'data'    => $this->model->find($id),
        ]);
    }

    // delete data by id
    public function delete($id)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Pengaduan tidak ditemukan',
            ]);
        }

        $this->model->delete($id);
        return $this->response->setJSON([
            'status'  => 'sukses',
            'message' => 'Pengaduan berhasil dihapus',
        ]);
    }

    // put buat update data by id/rating
    public function rating($id)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => 'error',
                'message' => 'Pengaduan tidak ditemukan',
            ]);
        }

        $input = $this->request->getJSON(true);
        if (!isset($input['rating']) || $input['rating'] < 1 || $input['rating'] > 5) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => 'error',
                'message' => 'Rating harus antara 1-5',
            ]);
        }

        $this->model->update($id, ['rating' => $input['rating'], 'status' => 'selesai']);
        return $this->response->setJSON([
            'status'  => 'sukses',
            'message' => 'Rating berhasil ditambahkan',
            'data'    => $this->model->find($id),
        ]);
    }
}