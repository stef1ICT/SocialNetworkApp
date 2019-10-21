using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace socialnetwork.Helpers
{
    public static class Extension
    {
        

        public static void AddApplicationError(this HttpResponse response, string message) {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response, int currentPage, int totalPage, int itemsPerPage, int totalItems) {
            var paginationHeader = new PaginationHeader(currentPage, totalPage, itemsPerPage, totalItems);
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, new JsonSerializerSettings {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            }));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    public static int calculateAge(this DateTime theDateTime) {
        var age = DateTime.Now.Year - theDateTime.Year;

        return age;
    }
    }
}