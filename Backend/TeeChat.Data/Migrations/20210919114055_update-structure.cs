using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TeeChat.Data.Migrations
{
    public partial class updatestructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserChat_Chats_ChatsId",
                table: "AppUserChat");

            migrationBuilder.DropColumn(
                name: "CreatorUserName",
                table: "Chats");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Users",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "ChatsId",
                table: "AppUserChat",
                newName: "JoinedChatsId");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateDeleted",
                table: "Messages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateModified",
                table: "Messages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Chats",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateDeleted",
                table: "Chats",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateModified",
                table: "Chats",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chats_CreatorId",
                table: "Chats",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserChat_Chats_JoinedChatsId",
                table: "AppUserChat",
                column: "JoinedChatsId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_Users_CreatorId",
                table: "Chats",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUserChat_Chats_JoinedChatsId",
                table: "AppUserChat");

            migrationBuilder.DropForeignKey(
                name: "FK_Chats_Users_CreatorId",
                table: "Chats");

            migrationBuilder.DropIndex(
                name: "IX_Chats_CreatorId",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "DateDeleted",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "DateDeleted",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "Chats");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Users",
                newName: "CreatedDate");

            migrationBuilder.RenameColumn(
                name: "JoinedChatsId",
                table: "AppUserChat",
                newName: "ChatsId");

            migrationBuilder.AddColumn<string>(
                name: "CreatorUserName",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserChat_Chats_ChatsId",
                table: "AppUserChat",
                column: "ChatsId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
