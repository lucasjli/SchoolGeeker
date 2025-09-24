using System.ComponentModel.DataAnnotations;

namespace SchoolGeeker.Models
{
    public class UserFavorite
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int SchoolID { get; set; }

        public DateTime? DateAdded { get; set; }
    }
}