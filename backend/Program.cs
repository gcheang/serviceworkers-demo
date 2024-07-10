using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https=//aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        // Allow requests from any origin, method, and header
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.MapGet("/api/ping", () =>
{
    return true;
}).WithOpenApi();

app.MapGet("/api/data", () =>
{
    var forecast = new List<object> {
        new { heroId= 0, heroName= "Zero" },
        new { heroId= 11, heroName= "Mr. Nice" },
        new { heroId= 12, heroName= "Narco" },
        new { heroId= 13, heroName= "Bombasto" },
        new { heroId= 14, heroName= "Celeritas" },
        new { heroId= 15, heroName= "Magneta" },
        new { heroId= 16, heroName= "RubberMan" },
        new { heroId= 17, heroName= "Dynama" },
        new { heroId= 18, heroName= "Dr IQ" },
        new { heroId= 19, heroName= "Magma" },
        new { heroId= 20, heroName= "Tornado" }
    };
    return forecast;
})
.WithOpenApi();

app.UseCors("CorsPolicy");

app.Run();
