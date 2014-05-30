using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DevSum2014.Demo.Web
{

    /// We don't like the default serialization of Guid values.
    public class GuidConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(Guid);
        }
        public override bool CanRead
        {
            get
            {
                return false;
            }
        }
        public override bool CanWrite
        {
            get
            {
                return true;
            }
        }
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var guid = (Guid)value;
            writer.WriteValue(guid.ToString().Replace("-", "").ToLowerInvariant());
        }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            // the default deserialization works fine, 
            // but otherwise we'd handle that here
            throw new NotImplementedException();
        }
    }

    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );


            var formatters = GlobalConfiguration.Configuration.Formatters;
            var jsonFormatter = formatters.JsonFormatter;
            var settings = jsonFormatter.SerializerSettings;
            settings.Formatting = Formatting.Indented;
           
            jsonFormatter.SerializerSettings.Converters.Add(new GuidConverter());

         
            settings.ContractResolver = new DefaultContractResolver();

        }
    }
}
