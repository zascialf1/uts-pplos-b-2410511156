<?php

namespace App\Models;

use CodeIgniter\Model;

class UnitModel extends Model
{
    protected $table         = 'unit';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['nama', 'email'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
}