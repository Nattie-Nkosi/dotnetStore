using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderEntityUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaymentSummary_Brand",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentSummary_ExpMonth",
                table: "Orders",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentSummary_ExpYear",
                table: "Orders",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentSummary_Last4",
                table: "Orders",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentSummary_Brand",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentSummary_ExpMonth",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentSummary_ExpYear",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentSummary_Last4",
                table: "Orders");
        }
    }
}
