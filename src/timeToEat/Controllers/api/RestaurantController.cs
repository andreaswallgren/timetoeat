using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace TimeToEat.Controllers.api
{
    // TODO: Add authorization
    [Route("api/[controller]")]
    public class RestaurantController : Controller
    {
        private ILogger logger;

        public RestaurantController(ILogger<RestaurantController> logger)
        {
            if (logger == null)
                throw new ArgumentNullException(nameof(logger));
            this.logger = logger;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            var restaurants = new List<object>();

            restaurants.Add(new { name = "Sang 'tajhyddan' Thai" });
            restaurants.Add(new { name = "Madame Maigret" });
            restaurants.Add(new { name = "Pizza 'vet hut' Hut" });

            logger.LogInformation($"Restaurants queried. Returning {restaurants.Count} items.");
            return Ok(restaurants);
        }
    }
}
