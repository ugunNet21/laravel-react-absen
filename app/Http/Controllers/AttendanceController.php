<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    public function recordAttendance(Request $request)
    {
        $request->validate([
            'location' => 'required|string',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            $attendance = new Attendance();
            $attendance->user_id = Auth::id();
            $attendance->attendance_time = now();
            $attendance->location = $request->input('location');

            if ($request->hasFile('photo')) {
                $filename = time() . '.' . $request->photo->extension();
                $path = $request->photo->storeAs('photos', $filename, 'public');
                $attendance->photo_path = $path;
            }

            $attendance->save();

            // Log attendance data on success
            // Log::info('Attendance recorded:', [
            //     'user_id' => $attendance->user_id,
            //     'attendance_time' => $attendance->attendance_time,
            //     'location' => $attendance->location,
            //     'photo_path' => $attendance->photo_path,
            // ]);

            return response()->json(['message' => 'Attendance recorded successfully']);
        } catch (\Exception $e) {
            // Log error message
            // Log::error('Failed to record attendance:', [
            //     'error' => $e->getMessage(),
            //     'user_id' => Auth::id(),
            //     'location' => $request->input('location'),
            // ]);

            return response()->json(['message' => 'Failed to record attendance'], 500);
        }
    }


    public function getAttendance()
    {
        $attendances = Attendance::where('user_id', Auth::id())->get();

        // Log attendances data
        // Log::info('Fetched attendances:', $attendances->toArray());

        return response()->json($attendances);
    }
}
