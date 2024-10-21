namespace StarWarApi2.Server.Models
{
    public class StarshipResponse
    {
        public int Count { get; set; }
        public string Next { get; set; }
        public string Previous { get; set; }
        public Starship[] Results { get; set; }
    }
}
