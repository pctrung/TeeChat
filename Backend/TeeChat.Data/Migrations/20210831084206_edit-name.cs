using Microsoft.EntityFrameworkCore.Migrations;

namespace TeeChat.Data.Migrations
{
    public partial class editname : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserChat_Users_PaticipantsId",
                table: "AppUserChat");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_ConverstationId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ConverstationId",
                table: "Messages",
                newName: "ChatId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ConverstationId",
                table: "Messages",
                newName: "IX_Messages_ChatId");

            migrationBuilder.RenameColumn(
                name: "PaticipantsId",
                table: "AppUserChat",
                newName: "ParticipantsId");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserChat_PaticipantsId",
                table: "AppUserChat",
                newName: "IX_AppUserChat_ParticipantsId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserChat_Users_ParticipantsId",
                table: "AppUserChat",
                column: "ParticipantsId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_ChatId",
                table: "Messages",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserChat_Users_ParticipantsId",
                table: "AppUserChat");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_ChatId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ChatId",
                table: "Messages",
                newName: "ConverstationId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ChatId",
                table: "Messages",
                newName: "IX_Messages_ConverstationId");

            migrationBuilder.RenameColumn(
                name: "ParticipantsId",
                table: "AppUserChat",
                newName: "PaticipantsId");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserChat_ParticipantsId",
                table: "AppUserChat",
                newName: "IX_AppUserChat_PaticipantsId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserChat_Users_PaticipantsId",
                table: "AppUserChat",
                column: "PaticipantsId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_ConverstationId",
                table: "Messages",
                column: "ConverstationId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
