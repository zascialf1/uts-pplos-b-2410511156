<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// api Pengaduan
$routes->get('pengaduan', 'PengaduanController::index');
$routes->get('pengaduan/(:num)', 'PengaduanController::show/$1');
$routes->post('pengaduan', 'PengaduanController::create');
$routes->put('pengaduan/(:num)/rating', 'PengaduanController::rating/$1');  // ← pindah ke atas
$routes->put('pengaduan/(:num)', 'PengaduanController::update/$1');
$routes->delete('pengaduan/(:num)', 'PengaduanController::delete/$1');