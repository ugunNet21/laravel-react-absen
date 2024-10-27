<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Buat peran jika belum ada
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $memberRole = Role::firstOrCreate(['name' => 'member']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);

        // Buat pengguna admin
        $admin = User::updateOrCreate([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole($adminRole);

        // Buat pengguna member
        $member = User::updateOrCreate([
            'name' => 'Member User',
            'email' => 'member@example.com',
            'password' => bcrypt('password'),
        ]);
        $member->assignRole($memberRole);

        // Buat pengguna manager
        $manager = User::updateOrCreate([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => bcrypt('password'),
        ]);
        $manager->assignRole($managerRole);
    }

}
