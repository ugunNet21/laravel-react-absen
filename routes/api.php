<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/attendance', [AttendanceController::class, 'recordAttendance']);
    Route::get('/attendance', [AttendanceController::class, 'getAttendance']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
