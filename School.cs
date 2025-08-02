using System.ComponentModel.DataAnnotations;

namespace SchoolGeeker
{
    public class School
    // Some information about the School table can be NULL, so add "?"
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public decimal Latitude { get; set; }
        [Required]
        public decimal Longitude { get; set; }
        [Required]
        public string Introduction { get; set; }
        public string? Logo { get; set; }
        [Required]
        public string? Telephone { get; set; }
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? EnrolmentInfo { get; set; }
        public string? EnrolmentForm { get; set; }  
        public string? SchoolZone { get; set; }
        public string? MoreInfo { get; set; }
    }
}
