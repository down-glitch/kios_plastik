<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Penting untuk Auth React
use Filament\Models\Contracts\FilamentUser; // Penting untuk Filament
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'is_active',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    // Cek apakah user boleh masuk ke Panel Admin Filament
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'admin' && $this->is_active;
    }

    // Fungsi pembantu untuk cek role petugas
    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }
}