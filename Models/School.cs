using System.ComponentModel.DataAnnotations;

namespace SchoolGeeker.Models
{
    public class School
    // Some information about the School table can be NULL, so add "?"
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Address { get; set; }
        public string mapview { get; set; }
        public string streetview { get; set; }
        [Required]
        public string Introduction { get; set; }
        public string? Logo { get; set; }
        public string? Telephone { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? EnrolmentInfo { get; set; }
        public string? EnrolmentForm { get; set; }  
        public string? SchoolZone { get; set; }
        public string? MoreInfo { get; set; }
        public ICollection<SchoolMedia> SchoolMedia { get; set; }
    }
}
