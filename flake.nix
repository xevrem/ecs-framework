{
  description = "ecsf nix env";

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    nodePkgs = with pkgs.nodePackages; [
      eslint
      pnpm
      prettier
      stylelint
      typescript
      typescript-language-server
      vscode-langservers-extracted
      yaml-language-server
    ];
    nodeDeps = [
      nodePkgs
    ];
    in
    {
      devShells.${system}.default =
        pkgs.mkShell {
          packages = nodeDeps ++ (with pkgs; [
            nodejs_20
          ]);
        };
    };
}
