using System.Text;
using back_end.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ---- 服務註冊 ----

// 純 Web API（不含 MVC Views）
builder.Services.AddControllers();

// 登入 / JWT 服務（記憶體假資料版）
builder.Services.AddSingleton<AuthService>();

// CORS：允許前端來源（可在 appsettings 的 Cors:AllowOrigins 設定）
var allowOrigins = builder.Configuration
    .GetSection("Cors:AllowOrigins")
    .Get<string[]>() ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Bearer 驗證
var jwt = builder.Configuration.GetSection("JWTSettings");
var signingKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(jwt["Key"] ?? "CHANGE_ME_TO_A_LONG_SECRET_KEY_32+"));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ---- HTTP 管線 ----

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
