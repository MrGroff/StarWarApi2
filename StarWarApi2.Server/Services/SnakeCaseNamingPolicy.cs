namespace StarWarApi2.Server.Services
{
    using System.Text.Json;

    public class SnakeCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            // Convert snake_case to PascalCase
            if (string.IsNullOrEmpty(name))
                return name;

            // Split by underscore, then capitalize each word and join back together
            var words = name.Split('_');
            return string.Concat(words.Select(word => char.ToUpperInvariant(word[0]) + word[1..]));
        }
    }
}
