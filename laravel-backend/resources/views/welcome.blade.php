<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laptop Store API - Powered by Laravel 12</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        code, pre {
            font-family: 'Fira Code', monospace;
        }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between">
    <!-- Header -->
    <header class="border-b border-slate-850 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span class="text-white font-bold text-lg">L</span>
                </div>
                <div>
                    <h1 class="font-bold text-xl tracking-tight text-white">Laptop Store API</h1>
                    <p class="text-xs text-slate-400">Laravel v12.0.0 &bull; PHP v8.2+</p>
                </div>
            </div>
            <span class="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                System Active
            </span>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-6 py-12 flex-grow flex flex-col justify-center">
        <div class="text-center space-y-6 mb-12">
            <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                High-Performance Backend Server
            </h2>
            <p class="text-lg text-slate-400 max-w-2xl mx-auto">
                Welcome to active routing. The laptop store REST API is perfectly hydrated with seeding data and running securely.
            </p>
        </div>

        <!-- API Reference Cards -->
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-300">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.5a13.917 13.917 0 00-6.1-11.51M9 11.25v.125c0 .345-.275.625-.625.625H4m5-1.25V10.5A1.25 1.25 0 007.75 9.25H4" />
                        </svg>
                    </div>
                    <span class="font-bold text-white text-lg">Authentication</span>
                </div>
                <ul class="space-y-2 text-sm text-slate-400">
                    <li class="flex justify-between items-center"><code class="text-indigo-400">POST /api/auth/register</code> <span>Register profile</span></li>
                    <li class="flex justify-between items-center"><code class="text-indigo-400">POST /api/auth/login</code> <span>Token issuance</span></li>
                    <li class="flex justify-between items-center"><code class="text-indigo-400">GET /api/auth/me</code> <span>Account profile [Auth]</span></li>
                </ul>
            </div>

            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-300">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <span class="font-bold text-white text-lg">Catalog & Checkout</span>
                </div>
                <ul class="space-y-2 text-sm text-slate-400">
                    <li class="flex justify-between items-center"><code class="text-indigo-400">GET /api/products</code> <span>List inventory</span></li>
                    <li class="flex justify-between items-center"><code class="text-indigo-400">POST /api/orders</code> <span>Create purchase [Auth]</span></li>
                    <li class="flex justify-between items-center"><code class="text-indigo-400">POST /api/coupons/validate</code> <span>Verify promo code</span></li>
                </ul>
            </div>
        </div>

        <!-- CLI Reference -->
        <div class="mt-12 bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                <span class="w-3.5 h-3.5 rounded-full bg-indigo-500 mr-2.5"></span>
                Local Development Commands
            </h3>
            <pre class="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm border border-slate-800 overflow-x-auto space-y-1">
<span class="text-slate-500"># Install php requirements and environment</span>
<span>composer install</span>
<span>copy .env.example .env</span>

<span class="text-slate-500"># Fire migrations and build key</span>
<span>php artisan key:generate</span>
<span>php artisan migrate --seed</span>

<span class="text-slate-500"># Start internal server</span>
<span>php artisan serve</span></pre>
        </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-850 py-6 bg-slate-950">
        <div class="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
            &copy; 127.0.0.1. Completed with active Artisan and Composer configurations.
        </div>
    </footer>
</body>
</html>
