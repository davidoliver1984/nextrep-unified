<?php

namespace Tests\Feature\Api;

use App\Models\User;

class AuthenticationTest extends ApiTestCase
{
    public function test_login_validates_credentials(): void
    {
        $this->postJson('/api/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);
    }

    public function test_application_routes_require_authentication(): void
    {
        foreach (['/api/user', '/api/exercises', '/api/journals', '/api/workouts', '/api/templates'] as $uri) {
            $this->getJson($uri)->assertUnauthorized();
        }
    }

    public function test_login_is_rate_limited_after_repeated_failures(): void
    {
        $credentials = [
            'email' => 'rate-limit@example.com',
            'password' => 'incorrect-password',
        ];

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/login', $credentials)
                ->assertUnprocessable();
        }

        $this->postJson('/api/login', $credentials)
            ->assertTooManyRequests();
    }
}
